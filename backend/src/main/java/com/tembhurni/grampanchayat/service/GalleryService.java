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
import java.util.stream.Collectors;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    private final String UPLOAD_DIR = "uploads"; // Optionally configurable

    public GalleryItem uploadItem(
            MultipartFile file,
            String category,
            String title,
            Integer year,
            String month,
            FileType type
    ) throws IOException {
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
        item.setFileUrl("/uploads/" + fileName); // For web access
        item.setUploadTimestamp(LocalDateTime.now());
        item.setType(type);

        return galleryItemRepository.save(item);
    }


 // Change to ascending order by id
    public List<GalleryItem> getItemsByCategory(String category) {
        return galleryItemRepository.findByCategoryOrderByIdAsc(category);
    }

 // Change to ascending order by id with limit
    public List<GalleryItem> getRecentItems(int count) {
        // Get all items in ascending order of ID
        List<GalleryItem> allItemsAsc = galleryItemRepository.findAllByOrderByIdAsc();

        // Filter to include only items with an actual file present in /uploads
        List<GalleryItem> itemsWithFiles = allItemsAsc.stream()
            .filter(item -> {
                // Remove "/uploads/" prefix to get filename
                String filename = item.getFileUrl().replace("/uploads/", "");
                return Files.exists(Paths.get(UPLOAD_DIR, filename));
            })
            .collect(Collectors.toList());

        // Return at most 'count' items
        return itemsWithFiles.stream().limit(count).collect(Collectors.toList());
    }

}