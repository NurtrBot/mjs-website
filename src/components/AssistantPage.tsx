"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Send, ShoppingCart, Plus, Minus, X,
  ArrowRight, Package, Loader2, Check,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { trackAddToCart } from "@/lib/analytics";

/* ── Types ── */
interface ChatProduct {
  slug: string;
  sku: string;
  name: string;
  cardTitle: string;
  brand: string;
  price: number;
  originalPrice?: number;
  pack: string;
  image: string;
  inStock: boolean;
  category?: string;
}

interface SupplyListItem extends ChatProduct {
  qty: number;
  reason: string;
}

interface ProductGroup {
  label: string;
  products: ChatProduct[];
}

interface ResponseBlock {
  type: "text" | "products" | "supply_list" | "product_groups" | "link";
  content?: string;
  products?: ChatProduct[];
  title?: string;
  items?: SupplyListItem[];
  groups?: ProductGroup[];
  label?: string;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  blocks?: ResponseBlock[];
}

/* ── Suggested prompts ── */
const QUICK_ACTIONS = [
  { label: "What size trash bags do I need for office cans?", icon: "", image: "/images/chat-icon-trash.png" },
  { label: "Should I use 55 gauge or 80 gauge stretch film?", icon: "📦" },
  { label: "Compare black vs. blue nitrile gloves", icon: "", image: "/images/chat-icon-gloves.png" },
  { label: "Best toilet paper for a commercial restroom?", icon: "", image: "/images/chat-icon-tp.png" },
  { label: "What chemicals do I need for a restaurant kitchen?", icon: "", image: "/images/chat-icon-chemicals.png" },
  { label: "What mop and bucket setup do you recommend?", icon: "", image: "/images/chat-icon-mop.png" },
];

/* ── Conversation persistence ── */
interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

function getConversations(userId: string): SavedConversation[] {
  try {
    const raw = localStorage.getItem(`mjs_chats_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveConversation(userId: string, convo: SavedConversation) {
  const all = getConversations(userId);
  const idx = all.findIndex(c => c.id === convo.id);
  if (idx >= 0) all[idx] = convo; else all.unshift(convo);
  // Keep last 50 conversations
  localStorage.setItem(`mjs_chats_${userId}`, JSON.stringify(all.slice(0, 50)));
}

function deleteConversation(userId: string, convoId: string) {
  const all = getConversations(userId).filter(c => c.id !== convoId);
  localStorage.setItem(`mjs_chats_${userId}`, JSON.stringify(all));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatRelativeDate(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Inline Product Card ── */
function InlineProductCard({ product }: { product: ChatProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      slug: product.slug, sku: product.sku, name: product.cardTitle,
      brand: product.brand, price: product.price, image: product.image, pack: product.pack,
    }, 1);
    trackAddToCart({ sku: product.sku, name: product.cardTitle, price: product.price, quantity: 1, category: product.category || "", brand: product.brand });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all w-[200px] sm:w-[220px] flex-shrink-0 flex flex-col">
      <a href={`/product/${product.slug}`} className="block h-[160px] bg-white relative overflow-hidden">
        {product.image?.startsWith("http") ? (
          <Image src={product.image} alt={product.cardTitle} fill sizes="220px" className="object-contain p-4 hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-10 h-10" />
          </div>
        )}
      </a>
      <div className="px-3.5 pb-3.5 pt-2 flex flex-col flex-1">
        <a href={`/product/${product.slug}`} className="text-sm font-semibold text-mjs-dark leading-snug line-clamp-2 hover:text-mjs-red transition-colors">
          {product.cardTitle}
        </a>
        <div className="text-[11px] text-gray-400 mt-0.5">{product.pack}</div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-black text-mjs-dark">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              added ? "bg-emerald-500 text-white" : "bg-mjs-dark text-white hover:bg-mjs-red"
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Product Card Strip with scroll arrows ── */
function ProductCardStrip({ products }: { products: ChatProduct[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [hovering, setHovering] = useState(false);

  const checkScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, [products]);

  const scroll = (dir: "left" | "right") => {
    stripRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div
      className="max-w-[800px] mx-auto px-4 relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-4 top-0 bottom-3 w-10 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-4 top-0 bottom-3 w-10 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      {/* Left arrow */}
      {hovering && showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Right arrow */}
      {hovering && showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      <div
        ref={stripRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto pb-3 px-2 scrollbar-hide"
      >
        {products.map((p) => (
          <InlineProductCard key={p.sku} product={p} />
        ))}
      </div>
    </div>
  );
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <div className="max-w-[800px] mx-auto px-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 flex-shrink-0 relative">
          <Image src="/images/mjs-assistant-avatar.png" alt="MJS" fill sizes="28px" className="object-contain" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AssistantPage() {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convoId, setConvoId] = useState(() => generateId());
  const [history, setHistory] = useState<SavedConversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userId = user?.id ? String(user.id) : null;

  // Load history on mount
  useEffect(() => {
    if (userId) setHistory(getConversations(userId));
  }, [userId]);

  // Save conversation whenever messages change
  useEffect(() => {
    if (!userId || messages.length === 0) return;
    const firstUserMsg = messages.find(m => m.role === "user");
    const title = firstUserMsg?.content.slice(0, 60) || "New conversation";
    saveConversation(userId, { id: convoId, title, messages, updatedAt: Date.now() });
    setHistory(getConversations(userId));
  }, [messages, convoId, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setConvoId(generateId());
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const handleLoadConvo = (convo: SavedConversation) => {
    setMessages(convo.messages);
    setConvoId(convo.id);
    setShowHistory(false);
  };

  const handleDeleteConvo = (id: string) => {
    if (!userId) return;
    deleteConversation(userId, id);
    setHistory(getConversations(userId));
    if (id === convoId) handleNewChat();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.role === "user" ? m.content : JSON.stringify({ blocks: m.blocks }),
          })),
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        blocks: data.blocks || [{ type: "text", content: "Sorry, something went wrong. Try again?" }],
      };
      setMessages([...newMessages, assistantMessage]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant", content: "",
        blocks: [{ type: "text", content: "Something went wrong. Please try again or call us at (714) 779-2640." }],
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="bg-gray-50 min-h-[70vh] flex relative">
      {/* ═══ Left Sidebar — History (logged-in users) ═══ */}
      {isLoggedIn && history.length > 0 && (
        <div className="hidden lg:block w-[220px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="px-3 pt-4 pb-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recents</div>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 text-sm text-mjs-dark hover:text-mjs-red transition-colors font-medium mb-3"
            >
              <Plus className="w-3.5 h-3.5 text-mjs-red" />
              New chat
            </button>
          </div>
          <div className="px-1">
            {history.map((convo) => (
              <div
                key={convo.id}
                onClick={() => handleLoadConvo(convo)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  convo.id === convoId ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-[13px] truncate flex-1 ${convo.id === convoId ? "text-mjs-dark font-medium" : "text-gray-600"}`}>
                  {convo.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteConvo(convo.id); }}
                  className="w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex-shrink-0"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Main Chat Column ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* New Chat button — top right, always visible for logged-in users */}
        {isLoggedIn && messages.length > 0 && (
          <div className="absolute top-3 right-4 z-20">
            <button
              onClick={handleNewChat}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-mjs-red hover:shadow-md transition-all group"
              title="New Chat"
            >
              <Plus className="w-4 h-4 text-mjs-red group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        {/* Mobile history toggle */}
        {isLoggedIn && history.length > 0 && (
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-mjs-dark transition-colors px-4 pt-3"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recents
            </button>
          </div>
        )}

        {/* Mobile history dropdown */}
        {showHistory && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
            <div className="absolute left-2 top-8 z-50 w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-y-auto max-h-[400px] lg:hidden">
              <div className="px-3 pt-3 pb-1">
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-1.5 text-sm text-mjs-dark hover:text-mjs-red transition-colors font-medium mb-1"
                >
                  <Plus className="w-3.5 h-3.5 text-mjs-red" />
                  New chat
                </button>
              </div>
              <div className="px-1 pb-2">
                {history.map((convo) => (
                  <div
                    key={convo.id}
                    onClick={() => handleLoadConvo(convo)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      convo.id === convoId ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-[13px] truncate flex-1 ${convo.id === convoId ? "text-mjs-dark font-medium" : "text-gray-600"}`}>
                      {convo.title}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteConvo(convo.id); }}
                      className="w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      {/* ═══ Chat Area ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* ── Empty State ── */
          <div className="max-w-[700px] mx-auto px-4 pt-6 sm:pt-10 pb-8">
            <div className="text-center mb-8">
              <div className="w-[200px] h-[200px] mx-auto -mb-2 relative">
                <Image src="/images/chatshop-logo.png" alt="ChatShop" fill sizes="200px" className="object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-mjs-dark tracking-tight leading-tight">
                Shop smarter. Just ask.
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm">
                Tell me what you need and I&apos;ll pull the best options from our catalog.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-[580px] mx-auto">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="text-center px-4 py-5 bg-white border border-gray-200 rounded-2xl text-xs text-gray-600 hover:border-mjs-red hover:shadow-md transition-all group leading-snug"
                >
                  {action.image ? (
                    <div className="w-14 h-14 mx-auto mb-2 relative">
                      <Image src={action.image} alt="" fill sizes="56px" className="object-contain" />
                    </div>
                  ) : (
                    <div className="text-4xl mb-2">{action.icon}</div>
                  )}
                  <span className="group-hover:text-mjs-red transition-colors font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div className="py-8 space-y-6">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  /* User message — right aligned */
                  <div className="max-w-[800px] mx-auto px-4">
                    <div className="flex justify-end">
                      <div className="bg-mjs-dark text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] sm:max-w-[65%]">
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Assistant message with blocks */
                  <div className="space-y-4">
                    {msg.blocks?.map((block, j) => (
                      <div key={j}>
                        {block.type === "text" && block.content && (
                          <div className="max-w-[800px] mx-auto px-4">
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 flex-shrink-0 mt-0.5 relative">
                                <Image src="/images/mjs-assistant-avatar.png" alt="MJS" fill sizes="28px" className="object-contain" />
                              </div>
                              <div className="max-w-[85%] sm:max-w-[70%]">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {block.type === "products" && block.products && block.products.length > 0 && (
                          <ProductCardStrip products={block.products} />
                        )}

                        {block.type === "supply_list" && block.items && block.items.length > 0 && (
                          <ProductCardStrip products={block.items} />
                        )}

                        {block.type === "product_groups" && block.groups && block.groups.length > 0 && (
                          <div className="space-y-5">
                            {block.groups.map((group, gi) => (
                              <div key={gi}>
                                <div className="max-w-[800px] mx-auto px-4 mb-2">
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{group.label}</span>
                                </div>
                                <ProductCardStrip products={group.products} />
                              </div>
                            ))}
                          </div>
                        )}

                        {block.type === "link" && block.url && (
                          <div className="max-w-[800px] mx-auto px-4">
                            <a
                              href={block.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-5 py-3 hover:border-mjs-red hover:shadow-md transition-all group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-mjs-red transition-colors">
                                <svg className="w-4 h-4 text-mjs-red group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-mjs-dark group-hover:text-mjs-red transition-colors">{block.label || "Download"}</div>
                                <div className="text-[10px] text-gray-400">PDF &middot; Click to download</div>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* ═══ Input Bar ═══ */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 via-gray-50 to-gray-50/0 pt-6 pb-8">
        <div className="max-w-[700px] mx-auto px-4">
          <div className="flex items-end gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-gray-200 focus-within:border-mjs-red/40 focus-within:shadow-xl transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="What are you looking for?"
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none py-1.5 max-h-[120px]"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() && !loading
                  ? "bg-mjs-red text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-[10px] text-gray-400 text-center mt-2.5">
            AI-powered recommendations &middot; Prices are current &middot; Call <a href="tel:7147792640" className="underline hover:text-gray-600">(714) 779-2640</a> for help
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
