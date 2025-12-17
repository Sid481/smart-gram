package com.tembhurni.grampanchayat.controller;

import java.util.List;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @GetMapping("/category/{category}")
    public List<GalleryItem> getGalleryItemsByCategory(@PathVariable String category) {
        return galleryService.getItemsByCategory(category);
    }

    @GetMapping("/recent")
    public List<GalleryItem> getRecentGalleryItems() {
        return galleryService.getRecentItems(10);
    }

    /**
     * Uploads a new gallery item and stores file bytes + metadata in the database.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadGalleryItem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam("title") String title,
            @RequestParam("year") Integer year,
            @RequestParam("month") String month,
            @RequestParam("type") String type
    ) {
        try {
            GalleryItem item = galleryService.uploadItem(
                    file, category, title, year, month, FileType.valueOf(type)
            );
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    /**
     * Serves the binary file content (image/PDF) stored in the database.
     * Frontend can use: <img src="/api/gallery/{id}/file" /> for images.
     */
    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getGalleryFile(@PathVariable Long id) {
        GalleryItem item = galleryService.getItemById(id);
        if (item == null || item.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = item.getContentType();
        if (contentType == null || contentType.isBlank()) {
            // Sensible default; you can refine based on FileType if needed
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(item.getFileData().length);
        // Optional: force download instead of inline display
        // headers.setContentDisposition(ContentDisposition.attachment()
        //        .filename(item.getTitle() != null ? item.getTitle() : "file")
        //        .build());

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(item.getFileData());
    }
}
