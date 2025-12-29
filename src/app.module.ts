/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',      // เพราะเรารัน NestJS ในเครื่องตัวเอง แต่ Database อยู่ใน Docker (ที่ forward port มาแล้ว)
            port: 5432,
            username: 'myuser',     // ต้องตรงกับใน docker-compose.yml
            password: 'mypassword', // ต้องตรงกับใน docker-compose.yml
            database: 'hotel_db',   // ต้องตรงกับใน docker-compose.yml
            autoLoadEntities: true,          // เดี๋ยวเราค่อยมาใส่ชื่อตารางตรงนี้
            synchronize: true,      // true = ให้แก้ตารางอัตโนมัติตามโค้ด (ใช้เฉพาะตอน dev)
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }