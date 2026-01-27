import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Plus, 
  Pin, 
  Lock, 
  Send,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  author_id: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  reply_count?: number;
}

interface CommunityReply {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id (full_name, avatar_url)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count replies for each post
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post) => {
          const { count } = await supabase
            .from('community_replies')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return { ...post, reply_count: count || 0 };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_replies')
        .select(`
          *,
          author:author_id (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setReplies(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPost = async (post: CommunityPost) => {
    setSelectedPost(post);
    await fetchReplies(post.id);
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          author_id: user.id,
        });

      if (error) throw error;

      toast.success("Discussion créée");
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'general' });
      fetchPosts();
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async () => {
    if (!user || !selectedPost || !newReply.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          post_id: selectedPost.id,
          content: newReply,
          author_id: user.id,
        });

      if (error) throw error;

      setNewReply('');
      fetchReplies(selectedPost.id);
      fetchPosts(); // Refresh reply counts
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      entraide: 'bg-blue-100 text-blue-800',
      activites: 'bg-purple-100 text-purple-800',
      annonces: 'bg-amber-100 text-amber-800',
    };
    return colors[category] || colors.general;
  };

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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              Espace communautaire
            </h1>
            <p className="text-muted-foreground mt-1">
              Échangez avec les autres adhérents
            </p>
          </div>
          <Button onClick={() => setShowNewPost(true)} className="gradient-ocean">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle discussion
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Posts List */}
          <div className="lg:col-span-1 space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p>Aucune discussion pour le moment</p>
                  <Button onClick={() => setShowNewPost(true)} className="mt-4">
                    Lancer une discussion
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map(post => (
                <Card
                  key={post.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedPost?.id === post.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectPost(post)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author?.avatar_url || undefined} />
                        <AvatarFallback>
                          {post.author?.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {post.is_pinned && <Pin className="h-3 w-3 text-amber-500" />}
                          {post.is_locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                          <Badge variant="secondary" className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.author?.full_name} • {post.reply_count} réponses
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Selected Post Detail */}
          <div className="lg:col-span-2">
            {selectedPost ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedPost.is_pinned && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Pin className="h-3 w-3 mr-1" />
                        Épinglé
                      </Badge>
                    )}
                    <Badge variant="secondary" className={getCategoryColor(selectedPost.category)}>
                      {selectedPost.category}
                    </Badge>
                  </div>
                  <CardTitle>{selectedPost.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedPost.author?.avatar_url || undefined} />
                      <AvatarFallback>
                        {selectedPost.author?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedPost.author?.full_name}</span>
                    <span>•</span>
                    <span>{format(new Date(selectedPost.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="whitespace-pre-wrap">{selectedPost.content}</p>

                  {/* Replies */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">{replies.length} réponse(s)</h4>
                    <div className="space-y-4">
                      {replies.map(reply => (
                        <div key={reply.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author?.avatar_url || undefined} />
                            <AvatarFallback>
                              {reply.author?.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {reply.author?.full_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(reply.created_at), 'd MMM à HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Form */}
                    {!selectedPost.is_locked && (
                      <div className="mt-4 flex gap-2">
                        <Textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Répondre à cette discussion..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleCreateReply}
                          disabled={!newReply.trim() || submitting}
                        >
                          {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>Sélectionnez une discussion</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* New Post Dialog */}
        <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">Titre</Label>
                <Input
                  id="post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sujet de la discussion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-category">Catégorie</Label>
                <select
                  id="post-category"
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded-md p-2"
                >
                  <option value="general">Général</option>
                  <option value="entraide">Entraide</option>
                  <option value="activites">Activités</option>
                  <option value="annonces">Annonces</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-content">Message</Label>
                <Textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Partagez votre message..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim() || submitting}
                className="gradient-ocean"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publication...
                  </>
                ) : (
                  'Publier'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Community;
