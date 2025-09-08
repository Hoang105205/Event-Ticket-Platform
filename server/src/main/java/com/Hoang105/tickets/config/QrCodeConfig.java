package com.Hoang105.tickets.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.zxing.qrcode.QRCodeWriter;

@Configuration
public class QrCodeConfig {
    
    @Bean
    public QRCodeWriter qrCodeWriter(){
        return new QRCodeWriter();
    }

}
