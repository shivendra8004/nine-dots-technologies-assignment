"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-token`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        router.push("/");
                    } else {
                        toast({
                            title: "Token Expired",
                            description: `${data.message}`,
                            variant: "destructive",
                        });
                        localStorage.removeItem("token");
                        return;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        verifyUser();
    }, [router]);

    const handleFormSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = {
            email,
            password,
        };
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setLoading(false);
                router.push("/");
            }
            if (data.message) {
                toast({
                    description: data.message,
                });
                setLoading(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Unable to login",
            });
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleFormSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Enter your email below to login to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="/auth/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit">
                            {loading ? <Loader className="animate-spin" /> : "Sign in"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
