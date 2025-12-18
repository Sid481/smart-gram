@Entity
@Table(name = "gallery_item")
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

	// getters/setters...
}
