package com.tembhurni.grampanchayat.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;


@Configuration
public class R2Config {

    @Value("${R2_ACCESS_KEY_ID}")
    private String keyId;

    @Value("${R2_SECRET_ACCESS_KEY}")
    private String secretKey;

    @Value("${R2_ENDPOINT}")
    private String endpoint;

    @Bean
    public AmazonS3 r2Client() {
        AWSCredentials credentials = new BasicAWSCredentials(keyId, secretKey);

        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withEndpointConfiguration(
                        new AwsClientBuilder.EndpointConfiguration(endpoint, "auto")
                )
                .withPathStyleAccessEnabled(true)
                .build();
    }
}
