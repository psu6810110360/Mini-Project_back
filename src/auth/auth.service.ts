import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(username: string, pass: string) {
        // 1. ค้นหา User จากชื่อ
        const user = await this.usersService.findOneByUsername(username);

        // 2. ถ้าไม่เจอ User หรือ รหัสผ่านไม่ตรง (ใช้ bcrypt เช็ค)
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }

        // 3. ถ้าถูกต้อง ให้สร้าง Token (Payload คือข้อมูลที่อยู่ในบัตร)
        const payload = { sub: user.id, username: user.username, role: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload), // ส่ง Token กลับไป
        };
    }
}