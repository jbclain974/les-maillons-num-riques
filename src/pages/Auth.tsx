import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      // Erreur gérée dans le contexte
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await signUp(signupData.email, signupData.password, signupData.fullName);
    } catch (error) {
      // Erreur gérée dans le contexte
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-10 w-10 text-primary" fill="currentColor" />
            <span className="text-2xl font-bold">Les Maillons de l'Espoir</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Espace d'administration
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          {/* Connexion */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte administrateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-ocean"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inscription */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                  Créez un nouveau compte administrateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-ocean"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      "Créer un compte"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
