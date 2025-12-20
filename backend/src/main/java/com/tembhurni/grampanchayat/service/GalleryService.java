package com.tembhurni.grampanchayat.service;

import com.tembhurni.grampanchayat.model.FileType;
import com.tembhurni.grampanchayat.model.GalleryItem;
import com.tembhurni.grampanchayat.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;

import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryService {

    @Autowired
    private GalleryItemRepository galleryRepository;

    @Autowired
    private AmazonS3 r2Client;

    @Value("${R2_BUCKET_NAME}")
    private String bucketName;

    @Value("${R2_PUBLIC_BASE_URL}") // example: https://pub-xxxxx.r2.dev
    private String publicBaseUrl;

    // --------------------------------------------------
    // GET ITEMS
    // --------------------------------------------------

    public List<GalleryItem> getItemsByCategory(String category) {
        return galleryRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public List<GalleryItem> getRecentItems(int limit) {
        return galleryRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit));
    }

    public GalleryItem getItemById(Long id) {
        return galleryRepository.findById(id).orElse(null);
    }

    // --------------------------------------------------
    // UPLOAD ITEM (R2 STORAGE)
    // --------------------------------------------------

    public GalleryItem uploadItem(
            MultipartFile file,
            String category,
            String title,
            Integer year,
            String month,
            FileType type) throws IOException {

        System.out.println("📤 Uploading file to R2...");

        // generate file name
        String extension = getExtension(file.getOriginalFilename());
        String uniqueName = UUID.randomUUID() + "." + extension;

        // folder structure
        String key = "gallery/" + year + "/" + month + "/" + uniqueName;

        // upload file to R2
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        r2Client.putObject(
                new PutObjectRequest(bucketName, key, file.getInputStream(), metadata)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        // create R2 public URL
        String publicUrl = publicBaseUrl + "/" + bucketName + "/" + key;

        // save DB
        GalleryItem item = new GalleryItem();
        item.setCategory(category);
        item.setTitle(title);
        item.setYear(year);
        item.setMonth(month);
        item.setFilepath(publicUrl);
        item.setContentType(file.getContentType());
        item.setFileType(type);
        item.setCreatedAt(LocalDateTime.now());

        galleryRepository.save(item);

        System.out.println("✅ File stored in R2 at " + publicUrl);

        return item;
    }

    // --------------------------------------------------
    // LOAD FILE FROM R2
    // --------------------------------------------------

    public byte[] loadFileBytes(GalleryItem item) throws IOException {
        try {
            System.out.println("📥 Downloading file from R2...");

            String url = item.getFilepath();

            // extract key from URL
            String key = url.substring(url.indexOf(bucketName) + bucketName.length() + 1);

            S3Object s3Object = r2Client.getObject(bucketName, key);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            return IOUtils.toByteArray(inputStream);

        } catch (Exception e) {
            System.err.println("❌ R2 load error: " + e.getMessage());
            throw new IOException("Failed to load file from R2", e);
        }
    }

    // --------------------------------------------------
    // DELETE FILE FROM R2 + DB ITEM
    // --------------------------------------------------

    public void deleteItem(Long id) throws IOException {
        GalleryItem item = getItemById(id);
        if (item == null) return;

        try {
            String url = item.getFilepath();
            String key = url.substring(url.indexOf(bucketName) + bucketName.length() + 1);

            r2Client.deleteObject(bucketName, key);

            System.out.println("🗑️ R2 object deleted: " + key);

        } catch (Exception e) {
            System.err.println("❌ R2 delete error: " + e.getMessage());
            throw new IOException("Failed to delete R2 object", e);
        }

        galleryRepository.deleteById(id);
        System.out.println("🗑️ DB record deleted: " + id);
    }

    // --------------------------------------------------
    // HELPERS
    // --------------------------------------------------

    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
