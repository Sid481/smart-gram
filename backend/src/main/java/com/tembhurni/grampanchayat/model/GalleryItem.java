package com.tembhurni.grampanchayat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_item")
public class GalleryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // Works with Postgres SERIAL / identity
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "year_value")
    private Integer year;

    @Column(length = 20)
    private String month;

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    private LocalDateTime uploadTimestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FileType type;   // IMAGE, VIDEO, PDF

    // getters and setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public LocalDateTime getUploadTimestamp() {
        return uploadTimestamp;
    }

    public void setUploadTimestamp(LocalDateTime uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }

    public FileType getType() {
        return type;
    }

    public void setType(FileType type) {
        this.type = type;
    }
}
