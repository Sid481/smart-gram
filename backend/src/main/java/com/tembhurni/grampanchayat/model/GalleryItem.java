package com.tembhurni.grampanchayat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_item")
public class GalleryItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Metadata
	private String title;
	private String category;
	private Integer year;
	private String month;

	/**
	 * Optional: if you later move to S3/CDN, you can still use this as an external URL.
	 * For now you may leave it null or use it as a logical path.
	 */
	private String fileUrl;

	private LocalDateTime uploadTimestamp;

	@Enumerated(EnumType.STRING)
	private FileType type; // IMAGE, VIDEO, PDF

	/**
	 * Binary file content stored in the database.
	 * For images/PDFs this maps to a PostgreSQL BYTEA column.
	 */
	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "file_data")
	private byte[] fileData;

	/**
	 * MIME type of the stored file, e.g. "image/jpeg", "image/png", "application/pdf".
	 */
	@Column(name = "content_type")
	private String contentType;

	// ===== Getters and setters =====

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
}
