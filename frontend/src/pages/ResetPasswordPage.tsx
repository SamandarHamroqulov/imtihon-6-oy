/**
 * Reset password page — uses OTP + new password.
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordPage() {
  const location = useLocation();
  const emailFromState = (location.state as any)?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !password || !confirmPassword) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    if (password.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Parollar mos kelmadi");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset/password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: password,
      });
      toast.success(
        "Parol muvaffaqiyatli yangilandi! Endi tizimga kirishingiz mumkin.",
      );
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Parolni yangilashda xatolik yuz berdi",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-reveal-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold">
            Parolni yangilash
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">
            Emailingizga yuborilgan kodni kiriting va yangi parolni tanlang
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!emailFromState && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div>
            <Label htmlFor="otp">Tiklash kodi</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Kodni kiriting"
              className="text-center tracking-widest"
            />
          </div>
          <div>
            <Label htmlFor="password">Yangi parol</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Parolni tasdiqlash</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Parolni qayta kiriting"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Spinner size={18} className="text-primary-foreground" />
            ) : (
              "Parolni yangilash"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
