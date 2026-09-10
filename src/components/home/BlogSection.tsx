import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, BookOpen, Quote } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogData } from "@/hooks/useBlogData";
import Reveal from "@/components/motion/Reveal";

export default function BlogSection() {
  const { blogs, isLoading } = useBlogData();
  const recentBlogs = blogs.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">Career Insights</span>
          </div>
          <h2 className="mb-4 font-serif">Latest from Our Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert career advice, industry insights, and practical tips to accelerate your professional growth.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse rounded-[var(--radius-bento)]">
                <div className="h-40 bg-muted" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {recentBlogs.slice(0, 2).map((post, index) => (
              <Reveal key={post.id} delay={index * 0.08}>
                <Card className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-bento)] border-border/80 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
                  <div className="relative flex h-40 flex-col justify-end overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-5">
                    <Quote
                      className="absolute -right-3 -top-3 h-24 w-24 text-white/10"
                      aria-hidden="true"
                      strokeWidth={1}
                    />
                    <span className="relative font-serif text-2xl leading-tight text-white">
                      {post.tags[0] || "Career Insights"}
                    </span>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[13px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base leading-6 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}

            {/* Wide tile: 3rd article + View All */}
            {recentBlogs[2] && (
              <Reveal delay={0.16} className="sm:col-span-2">
                <Card className="group flex flex-col overflow-hidden rounded-[var(--radius-bento)] border-border/80 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] sm:flex-row">
                  <div className="relative flex h-40 shrink-0 flex-col justify-end overflow-hidden bg-gradient-to-br from-accent to-accent-hover p-5 sm:h-auto sm:w-64">
                    <Quote
                      className="absolute -right-3 -top-3 h-24 w-24 text-white/10"
                      aria-hidden="true"
                      strokeWidth={1}
                    />
                    <span className="relative font-serif text-2xl leading-tight text-white">
                      {recentBlogs[2].tags[0] || "Career Insights"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {recentBlogs[2].tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[13px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {recentBlogs[2].title}
                      </CardTitle>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <span>{recentBlogs[2].author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(recentBlogs[2].date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/blog/${recentBlogs[2].slug}`}>Read More</Link>
                      </Button>
                      <Link
                        to="/blog"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors"
                      >
                        View All Articles
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
