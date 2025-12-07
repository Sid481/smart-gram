# -------- Build stage --------
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set work directory
WORKDIR /app

# Copy only pom.xml first for better Docker cache usage
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN mvn -q -B dependency:go-offline

# Now copy the rest of the source code
COPY src ./src

# Build the jar (skip tests for faster build in CI)
RUN mvn clean package -DskipTests


# -------- Run stage --------
FROM eclipse-temurin:17-jre-alpine

# Work directory inside container
WORKDIR /app

# Copy the built jar from the build stage
# Your jar (from screenshot & pom) is: smart-gram-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/smart-gram-0.0.1-SNAPSHOT.jar app.jar

# Render will set $PORT at runtime. Spring Boot can use it via server.port=${PORT:8080}
ENV PORT=8080

# (Optional) Java options (uncomment & tweak if needed)
# ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Expose the port (for local usage; Render detects from $PORT)
EXPOSE 8080

# Start the app

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
