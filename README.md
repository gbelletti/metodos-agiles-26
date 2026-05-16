# Sistema de gestión de licencias de conducir

Trabajo práctico para Métodos Ágiles 2026

# Dependencias

Para Windows:

- Git → [LINK](https://git-scm.com/download/win)
- Node.js → [LINK](https://nodejs.org)
- Java 21 → [LINK](https://adoptium.net) (Temurin 21)
- Maven → [LINK](https://maven.apache.org/download.cgi)

Después de descomprimir, tenés que agregar la variable de entorno MAVEN_HOME apuntando a la carpeta de Maven, y agregar %MAVEN_HOME%\bin al PATH del sistema. Buscá "Variables de entorno" en el menú inicio para encontrar la configuración.

Para Linux:

```
sudo apt update
sudo apt install git nodejs npm openjdk-21-jdk maven
```

## Verificar

Si todo está ok, en la consola del Visual todas deben dar su versión.

```
git --version
node --version
npm --version
java --version
mvn --version
```

# Pasos

## 1. Clonar el repo

```
git clone https://github.com/gbelletti/metodos-agiles-26.git
```

## 2. Descargar .env

El archivo env tiene las claves para acceder a la base de datos. Está en el discord.
Una vez descargado, pegarlo en `\metodos-agiles-26\backend`

## 3. Instalar paquetes npm

Con la carpeta abierta `metodos-agiles-26` en consola:

```
cd frontend
npm install
```

## 4. Iniciar front+back para interactuar con proyecto

### Iniciar front

Con la carpeta abierta `metodos-agiles-26` en consola:

```
cd frontend
npm run dev
```

El frontend corre en http://localhost:3000

### Iniciar back

Con la carpeta abierta `metodos-agiles-26` en consola:

```
cd backend
mvn spring-boot:run
```

El backend corre en http://localhost:8080
