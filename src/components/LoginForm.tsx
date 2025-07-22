/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Stethoscope, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/api/auth.api';

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const { toast } = useToast();

  // const handleLogin = async (role: 'admin' | 'doctor' | 'collaborator') => {
  //   setLoading(true);
  //   // Simulate login process
  //   setTimeout(() => {
  //     onLogin({
  //       role,
  //       name: role === 'admin' ? 'Admin Gentis' : 'Bác sĩ Nguyễn Văn A',
  //       phone: phone
  //     });
  //     setLoading(false);
  //     toast({
  //       title: "Đăng nhập thành công",
  //       description: "Chào mừng bạn đến với Gentis",
  //     });
  //   }, 1000);
  // };

  const smartTelexConvert = (text: string): string => {
    let result = text;

    //chuyen dấu
    const conversions = [
      { from: /â/g, to: 'aa' }, { from: /ê/g, to: 'ee' }, { from: /ô/g, to: 'oo' },
      { from: /Â/g, to: 'AA' }, { from: /Ê/g, to: 'EE' }, { from: /Ô/g, to: 'OO' },
      { from: /ă/g, to: 'aw' }, { from: /ơ/g, to: 'ow' }, { from: /ư/g, to: 'uw' },
      { from: /Ă/g, to: 'AW' }, { from: /Ơ/g, to: 'OW' }, { from: /Ư/g, to: 'UW' },
      { from: /đ/g, to: 'dd' }, { from: /Đ/g, to: 'DD' },
      { from: /[àèìòùỳ]/g, to: (match) => match.normalize('NFD').replace(/[\u0300]/g, '') + 'f' },
      { from: /[áéíóúý]/g, to: (match) => match.normalize('NFD').replace(/[\u0301]/g, '') + 's' },
      { from: /[ạẹịọụỵ]/g, to: (match) => match.normalize('NFD').replace(/[\u0323]/g, '') + 'j' },
      { from: /[ảẻỉỏủỷ]/g, to: (match) => match.normalize('NFD').replace(/[\u0309]/g, '') + 'r' },
      { from: /[ãẽĩõũỹ]/g, to: (match) => match.normalize('NFD').replace(/[\u0303]/g, '') + 'x' },
    ];

    conversions.forEach(rule => {
      result = result.replace(rule.from, rule.to as string);
    });

    return result;
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      console.log('Gửi request login với:', { username, password });
  
      const response = await login({ username, password });
      console.log('Phản hồi từ server:', response);
  
      const { accessToken, user } = response.data;
  
      console.log('Đăng nhập thành công, accessToken:', accessToken);
  
  
      localStorage.setItem('accessToken', accessToken);
      onLogin({ ...user });
  
      toast({
        title: 'Đăng nhập thành công',
        //description: `Chào mừng ${user.name}`,
      });
    } catch (err: any) {
      console.error('Lỗi khi đăng nhập:', err);
      toast({
        title: 'Đăng nhập thất bại',
        description:
          err?.response?.data?.message?.join?.(', ') || err?.message || 'Vui lòng thử lại',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!resetPhone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate password reset
    toast({
      title: "Đã gửi mã reset",
      description: `Mã reset mật khẩu đã được gửi tới ${resetPhone}`,
    });
    setShowForgotPassword(false);
    setResetPhone('');
  };

  if (showForgotPassword) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl text-slate-700">Quên mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resetPhone">Số điện thoại</Label>
              <Input
                id="resetPhone"
                type="tel"
                placeholder="Nhập số điện thoại đã đăng ký"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={handleForgotPassword}
            >
              Gửi mã reset
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl text-slate-700">Đăng nhập hệ thống</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
          </div>
          {/* password, eye icon */}
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              //tieng viet khong dau
              onChange={(e) => {
                const telexValue = smartTelexConvert(e.target.value);
                setPassword(telexValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
              className="mt-1"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

        {/* <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin" className="text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-sm">
              <Stethoscope className="h-4 w-4 mr-1" />
              Gentis
            </TabsTrigger>
            <TabsTrigger value="collaborator" className="text-sm">
              <User className="h-4 w-4 mr-1" />
              Bác sĩ
            </TabsTrigger>
          </TabsList> */}
          
          {/* <TabsContent value="admin" className="mt-4">
            <Button 
              className="w-full bg-red-600 hover:bg-red-700" 
              onClick={() => handleLogin('admin')}
              disabled={loading}
            >
              Đăng nhập với quyền Admin
            </Button>
          </TabsContent>
          
          <TabsContent value="doctor" className="mt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleLogin('doctor')}
              disabled={loading}
            >
              Đăng nhập Gentis 
            </Button>
          </TabsContent>
          
          <TabsContent value="collaborator" className="mt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700" 
              onClick={() => handleLogin('collaborator')}
              disabled={loading}
            >
              Đăng nhập Bác Sĩ
            </Button>
          </TabsContent>
        </Tabs> */}

        {
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleLogin()}
              disabled={loading}
            >
              Đăng nhập
            </Button>
        }

        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-sm text-blue-600"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};