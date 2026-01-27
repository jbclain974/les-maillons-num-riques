import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Users, 
  Search,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Member {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active_member: boolean;
  participation_count: number;
}

const MemberDirectory = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Note: This query will be filtered by RLS policies
      // Admins see all, regular users see limited info
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, is_active_member, participation_count')
        .eq('is_active_member', true)
        .order('full_name');

      if (error) throw error;

      setMembers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <Button variant="ghost" onClick={() => navigate('/membre')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Annuaire des membres
          </h1>
          <p className="text-muted-foreground mt-1">
            Retrouvez les adhérents de l'association
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Aucun membre trouvé</p>
              <p className="text-muted-foreground">
                {searchTerm ? "Essayez une autre recherche" : "L'annuaire est vide pour le moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map(member => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                        {member.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {member.full_name || 'Membre'}
                      </h3>
                      {member.is_active_member && (
                        <Badge className="bg-green-100 text-green-800 mt-1">
                          Membre actif
                        </Badge>
                      )}
                      {member.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {member.bio}
                        </p>
                      )}
                      {member.participation_count > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {member.participation_count} participation(s)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {filteredMembers.length} membre(s) trouvé(s)
        </div>
      </div>
    </Layout>
  );
};

export default MemberDirectory;
