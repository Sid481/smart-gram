package com.tembhurni.grampanchayat.controller;

import java.io.IOException;
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
            FileType fileType;
            try {
                fileType = FileType.valueOf(type);
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body("Invalid file type: " + type);
            }

            GalleryItem item = galleryService.uploadItem(
                    file, category, title, year, month, fileType
            );
            return ResponseEntity.ok(item);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getGalleryFile(@PathVariable Long id) {
        GalleryItem item = galleryService.getItemById(id);
        if (item == null || item.getFileUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = item.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        try {
            byte[] bytes = galleryService.loadFileBytes(item);
            if (bytes == null) {
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(bytes.length);
            headers.setCacheControl("public, max-age=86400"); // cache images for 1 day

            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
