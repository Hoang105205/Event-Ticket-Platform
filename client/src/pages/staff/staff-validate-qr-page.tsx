import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
    TicketValidationMethod,
    TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import jsQR from "jsqr";
import { motion, AnimatePresence } from "framer-motion";

const StaffValidateQrPage: React.FC = () => {
    const { isLoading, user } = useAuth();
    const [hasCamera, setHasCamera] = useState(false);
    const [mode, setMode] = useState<"camera" | "upload" | "manual">("camera");
    const [data, setData] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [validationStatus, setValidationStatus] = useState<
        TicketValidationStatus | undefined
    >();
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        navigator.mediaDevices
            ?.enumerateDevices()
            .then((devices) => {
                const videoInputs = devices.filter((d) => d.kind === "videoinput");
                setHasCamera(videoInputs.length > 0);
                if (videoInputs.length === 0) {
                    setMode("upload");
                }
            })
            .catch(() => {
                setHasCamera(false);
                setMode("upload");
            });
    }, []);

    const handleReset = () => {
        setMode(hasCamera ? "camera" : "upload");
        setData(undefined);
        setError(undefined);
        setValidationStatus(undefined);
        setPreview(null);
    };

    const handleError = (err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else if (typeof err === "string") setError(err);
        else setError("An unknown error occurred");
    };

    const handleValidate = async (id: string, method: TicketValidationMethod) => {
        if (!user?.access_token) return;
        try {
            const response = await validateTicket(user.access_token, {
                id,
                method,
            });
            setValidationStatus(response.status);
        } catch (err) {
            handleError(err);
        }
    };

    const handleUploadQr = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            setPreview(img.src);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    setData(code.data);
                } else {
                    setError("Không đọc được QR code từ ảnh");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    if (isLoading || !user?.access_token) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex justify-center items-center">
            <div className="border border-gray-400 max-w-sm w-full p-4">
                {error && (
                    <Alert
                        variant="destructive"
                        className="bg-gray-900 border-red-700 mb-4"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <AnimatePresence mode="wait">
                    {/* Camera scanner */}
                    {mode === "camera" && hasCamera && (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-lg overflow-hidden mx-auto mb-8 relative"
                        >
                            <Scanner
                                key={`scanner-${data}-${validationStatus}`}
                                onScan={(result) => {
                                    if (result) {
                                        const qrCodeId = result[0].rawValue;
                                        setData(qrCodeId);
                                        handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                                    }
                                }}
                                onError={handleError}
                            />
                            {/* Hiệu ứng check / X trong camera box */}
                            {validationStatus && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    {validationStatus === TicketValidationStatus.VALID ? (
                                        <div className="bg-green-500 rounded-full p-4">
                                            <Check className="w-20 h-20" />
                                        </div>
                                    ) : (
                                        <div className="bg-red-500 rounded-full p-4">
                                            <X className="w-20 h-20" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Upload */}
                    {mode === "upload" && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3 }}
                            className="pb-8 relative"
                        >
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full text-white text-lg mb-4"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleUploadQr(e.target.files[0]);
                                    }
                                }}
                            />

                            {preview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 flex flex-col items-center relative"
                                >
                                    <img
                                        src={preview}
                                        alt="QR Preview"
                                        className="max-h-40 rounded-md border border-gray-500 shadow-lg mb-2"
                                    />
                                    {data && (
                                        <>
                      <span className="text-sm text-gray-300 mb-2">
                        Nội dung: {data}
                      </span>
                                            <Button
                                                className="bg-purple-500 w-full h-[60px] hover:bg-purple-800"
                                                onClick={() =>
                                                    handleValidate(data, TicketValidationMethod.QR_SCAN)
                                                }
                                            >
                                                Submit
                                            </Button>
                                        </>
                                    )}

                                    {/* ✅ Hiệu ứng ngay trên preview box */}
                                    {validationStatus && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40"
                                        >
                                            {validationStatus === TicketValidationStatus.VALID ? (
                                                <div className="bg-green-500 rounded-full p-4">
                                                    <Check className="w-16 h-16" />
                                                </div>
                                            ) : (
                                                <div className="bg-red-500 rounded-full p-4">
                                                    <X className="w-16 h-16" />
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Manual input */}
                    {mode === "manual" && (
                        <motion.div
                            key="manual"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="pb-8 relative"
                        >
                            <Input
                                className="w-full text-white text-lg mb-4"
                                onChange={(e) => setData(e.target.value)}
                            />
                            <Button
                                className="bg-purple-500 w-full h-[80px] hover:bg-purple-800"
                                onClick={() =>
                                    handleValidate(data || "", TicketValidationMethod.MANUAL)
                                }
                            >
                                Submit
                            </Button>

                            {/* ✅ Hiệu ứng ngay trong box manual */}
                            {validationStatus && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40"
                                >
                                    {validationStatus === TicketValidationStatus.VALID ? (
                                        <div className="bg-green-500 rounded-full p-4">
                                            <Check className="w-16 h-16" />
                                        </div>
                                    ) : (
                                        <div className="bg-red-500 rounded-full p-4">
                                            <X className="w-16 h-16" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Switcher buttons */}
                <div className="mt-4">
                    {hasCamera && (
                        <Button
                            className="bg-gray-900 hover:bg-gray-600 border-gray-500 border-2 w-full h-[60px] text-lg my-2"
                            onClick={() => setMode("camera")}
                        >
                            Camera Scan
                        </Button>
                    )}
                    <Button
                        className="bg-gray-900 hover:bg-gray-600 border-gray-500 border-2 w-full h-[60px] text-lg my-2"
                        onClick={() => setMode("upload")}
                    >
                        Upload QR
                    </Button>
                    <Button
                        className="bg-gray-900 hover:bg-gray-600 border-gray-500 border-2 w-full h-[60px] text-lg my-2"
                        onClick={() => setMode("manual")}
                    >
                        Manual Input
                    </Button>
                </div>

                <Button
                    className="bg-gray-500 hover:bg-gray-800 w-full h-[60px] text-lg my-4"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
};

export default StaffValidateQrPage;
