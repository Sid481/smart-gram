package com.tembhurni.grampanchayat.model;

import java.time.LocalDateTime;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gallery_item")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GalleryItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String category;
	private Integer year;
	private String month;

	// Now required for disk path or URL
	private String fileUrl;

	private LocalDateTime uploadTimestamp;

	@Enumerated(EnumType.STRING)
	private FileType type; // IMAGE, VIDEO, PDF

	// Optional: keep for small files only, or remove entirely once migrated
	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "file_data")
	private byte[] fileData;

	@Column(name = "content_type")
	private String contentType;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public byte[] getFileData() {
		return fileData;
	}

	public void setFileData(byte[] fileData) {
		this.fileData = fileData;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	// getters/setters...
}
