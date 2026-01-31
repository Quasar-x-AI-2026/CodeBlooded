import { useState, useEffect } from "react";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(() => {
    // Get liked posts from localStorage
    try {
      return JSON.parse(localStorage.getItem("likedPosts") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/feed`
      );
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data?.posts || []);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts.includes(postId);
    const action = isLiked ? "unlike" : "like";

    // Optimistic update
    if (isLiked) {
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
    } else {
      setLikedPosts((prev) => [...prev, postId]);
    }

    // Update localStorage
    const newLikedPosts = isLiked
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));

    // Update the post count locally
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, likeCount: post.likeCount + (isLiked ? -1 : 1) }
          : post
      )
    );

    // Send to server
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/feed/${postId}/like-guest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
    } catch (err) {
      console.error("Failed to update like:", err);
      // Revert on error
      setLikedPosts(likedPosts);
      fetchPosts();
    }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      relief: { bg: "#05966915", text: "#059669", icon: "🎁" },
      rescue: { bg: "#dc262615", text: "#dc2626", icon: "🚑" },
      donation: { bg: "#0891b215", text: "#0891b2", icon: "💰" },
      awareness: { bg: "#8b5cf615", text: "#8b5cf6", icon: "📢" },
      volunteer: { bg: "#f59e0b15", text: "#f59e0b", icon: "🤝" },
      other: { bg: "#6b728015", text: "#6b7280", icon: "📌" },
    };
    return styles[category] || styles.other;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--card-foreground)" }}>
          📰 NGO Stories & Highlights
        </h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{ 
          backgroundColor: "#05966915", 
          color: "#059669" 
        }}>
          Live Feed
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
            style={{ borderColor: "var(--primary)" }} 
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            No stories yet. NGOs can share their work here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const catStyle = getCategoryStyle(post.category);
            const isLiked = likedPosts.includes(post._id);

            return (
              <article
                key={post._id}
                className="p-4 rounded-xl border transition hover:shadow-md"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                      background: "linear-gradient(135deg, #0891b2, #059669)",
                      color: "white",
                    }}
                  >
                    {post.ngoId?.name?.charAt(0) || "N"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>
                      {post.ngoId?.name || "Unknown NGO"}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span>📍 {post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
                    style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                  >
                    {catStyle.icon} {post.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold text-base mb-2" style={{ color: "var(--foreground)" }}>
                  {post.headline}
                </h3>
                <p className="text-sm line-clamp-3 mb-3" style={{ color: "var(--muted-foreground)" }}>
                  {post.content}
                </p>

                {/* Image */}
                {post.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.headline}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1.5 text-sm font-medium transition hover:scale-105"
                    style={{
                      color: isLiked ? "#dc2626" : "var(--muted-foreground)",
                    }}
                  >
                    <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                    <span>{post.likeCount || 0}</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-sm font-medium transition hover:scale-105"
                    style={{ color: "var(--muted-foreground)" }}
                    onClick={() => {
                      navigator.share?.({
                        title: post.headline,
                        text: post.content,
                        url: window.location.href,
                      });
                    }}
                  >
                    <span className="text-lg">🔗</span>
                    <span>Share</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
