"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = otpGenerator;
function otpGenerator() {
    let otp = Math.floor(100000 + Math.random() * 900000);
    let otpExpires = Date.now() + 3 * 60 * 1000;
    return { otp, otpExpires };
}
