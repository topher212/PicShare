# PicShare - Comparte Momentos a través de Fotos

## Descripción
PicShare es una aplicación de red social que te permite compartir tus momentos especiales a través de fotos.  
Inspirada en Instagram, esta plataforma permite a los usuarios publicar imágenes con o sin textos y ofrece la posibilidad de interactuar mediante "likes" y comentarios.


## Características

### Usuarios Anónimos
- **Explorar**: Descubre las últimas fotos publicadas por otros usuarios en PicShare.
- **Perfiles de Usuarios**: Visualiza el perfil de un usuario con su galería de fotos.
- **Búsqueda por Texto**: Encuentra fotos buscando por palabras clave o descripciones.
- **Login**: Inicia sesión para acceder a más funcionalidades.
- **Registro**: Crea una cuenta en PicShare y únete a la comunidad de compartidores de momentos.

### Usuarios Registrados
- **Publicar Fotos**: Sube tus fotos favoritas, que se ajustarán automáticamente a un tamaño máximo y proporciones establecidas por la plataforma. Añádeles una descripción para contar la historia detrás de cada imagen.
- **Likes**: Exprésate dando "likes" a las fotos que te gusten y retira tu "like" si cambias de opinión.
- **Gestión de Perfil**: Actualiza tu perfil y realiza cambios en tus datos de registro.
- **Comentarios**: Interactúa con otros usuarios dejando comentarios en sus fotos.

  
## Instalación

1. Clona este repositorio en tu máquina local.

2. Instala las dependencias utilizando el gestor de paquetes `npm`.

```bash
npm install @hapi/joi dotenv express express-fileupload jsonwebtoken morgan mysql2 nodemon sharp uuid
```


## Variables de entorno

Para utilizar este proyecto, se necesitan las siguientes variables de entorno en el archivo .env

`HOST`
`USER`
`PASSWORD`
`DATABASE`
`SECRET_TOKEN`
`PORT`
`UPLOADS_DIRECTORY`


## Tech Stack

**Server:** Node, Express


## Autores

- [@dgr92](https://github.com/dgr92) - David Graciá
- [@godwitoski](https://github.com/godwitoski) - Juan Esteban De León
- [@liliperezglez](https://github.com/liliperezglez) - Liliana Pérez
- [@topher212](https://github.com/topher212) - Cristopher Herrán


## 🔗 Enlaces

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-gr/) David Graciá 

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/juanesteban-deleonrosario/) Juan Esteban De León

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/liliana-perez-gonzalez//) Liliana Pérez

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/cristopher-herr%C3%A1n-guerreiro/) Cristopher Herrán
