package com.tembhurni.grampanchayat.service;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    private final String UPLOAD_DIR = "uploads"; // Optionally configurable

    public GalleryItem uploadItem(MultipartFile file, String category, String title,
                                  Integer year, String month, String uploadedBy, FileType type) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path targetPath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        GalleryItem item = new GalleryItem();
        item.setTitle(title);
        item.setCategory(category);
        item.setYear(year);
        item.setMonth(month);
        item.setFileUrl("/uploads/" + fileName); // For web access, adjust if needed.
        item.setUploadedBy(uploadedBy);
        item.setUploadTimestamp(LocalDateTime.now());
        item.setType(type);

        return galleryItemRepository.save(item);
    }

    public List<GalleryItem> getItemsByCategory(String category) {
        return galleryItemRepository.findByCategoryOrderByUploadTimestampDesc(category);
    }

    public List<GalleryItem> getRecentItems(int count) {
        // For "top N" recent items, use repository method with limit if available
        return galleryItemRepository.findTop10ByOrderByUploadTimestampDesc();
    }
}