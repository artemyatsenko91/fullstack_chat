import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule);

    app.enableCors();
    await app.listen(5000);
}
bootstrap();
