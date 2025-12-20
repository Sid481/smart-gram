package com.tembhurni.grampanchayat.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gallery")
@Data
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

	/**
	 * PUBLIC R2 URL stored as string
	 * example: https://pub-XXXX.r2.dev/smartgram/gallery/2025/JAN/photo.png
	 */
	@Column(name = "filepath", nullable = true)
	private String filepath;

	/**
	 * Timestamp when uploaded
	 */
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	/**
	 * MIME type (image/png, video/mp4, application/pdf etc)
	 */
	@Column(name = "content_type")
	private String contentType;

	/**
	 * IMAGE / VIDEO / PDF
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "file_type")
	private FileType fileType;
}
