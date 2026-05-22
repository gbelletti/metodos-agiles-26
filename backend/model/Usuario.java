@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String apellido;
    
    @Column(name = "nombre_usuario", unique = true)
    private String nombreUsuario;
    
    private String contrasena;
    private String rol;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @ManyToOne
    @JoinColumn(name = "creado_por_id")
    private Usuario creadoPor;
    
    // getters y setters...
}
