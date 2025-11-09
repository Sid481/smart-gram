package com.tembhurni.grampanchayat.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Entity
public class GalleryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private Integer year;
    private String month;
    private String fileUrl;
    private String uploadedBy;
    private LocalDateTime uploadTimestamp;

    @Enumerated(EnumType.STRING)
    private FileType type; // IMAGE, VIDEO, PDF

    // getters and setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public LocalDateTime getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(LocalDateTime uploadTimestamp) { this.uploadTimestamp = uploadTimestamp; }
    public FileType getType() { return type; }
    public void setType(FileType type) { this.type = type; }
}
