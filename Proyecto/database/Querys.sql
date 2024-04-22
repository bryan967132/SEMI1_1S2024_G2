USE proyecto;

SELECT * FROM proyecto.USUARIO;
SELECT * FROM proyecto.FAVORITO;
SELECT * FROM proyecto.RECURSO;
SELECT * FROM proyecto.CALIFICACION;
SELECT * FROM proyecto.CATEGORIA;

-- ATRIBUTOS DE RECURSO ESPECÍFICO
SELECT id, titulo, descripcion, imagen FROM proyecto.RECURSO WHERE id = 1;
-- CONFIRMAR SI HAY FAVORITO ESPECÍFICO
SELECT 1 FROM proyecto.FAVORITO WHERE id_usuario = 1 AND id_recurso = 2;
-- OBTENER COMENTARIOS
SELECT u.usuario, c.punteo, c.comentario
FROM proyecto.CALIFICACION c
INNER JOIN proyecto.RECURSO r ON r.id = c.id_recurso
INNER JOIN proyecto.USUARIO u ON u.id = c.id_usuario
WHERE r.id = 3;
-- OBTENER CALIFICACIÓN PROMEDIO
SELECT AVG(c.punteo) AS calificacion
FROM proyecto.CALIFICACION c
INNER JOIN proyecto.RECURSO r ON r.id = c.id_recurso
WHERE r.id = 1;

-- AGREGAR/QUITAR FAVORITO
SELECT * FROM proyecto.FAVORITO WHERE id_usuario = 7 AND id_recurso = 3;
INSERT INTO proyecto.FAVORITO(id_usuario, id_recurso, activo) VALUES (1, 2, 1);
UPDATE proyecto.FAVORITO SET activo = 0 WHERE id_usuario = 1 AND id_recurso = 2;

-- COMENTAR/CALIFICAR
INSERT INTO proyecto.CALIFICACION(punteo, comentario, id_recurso) VALUES (4, "Es un muy buen recurso educativo", 2);