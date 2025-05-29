"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, User, Medal } from "lucide-react";

import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  profile_picture: string | null;
  score: number;
  rank: number;
  is_current_user: boolean;
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api<LeaderboardUser[]>("/api/leaderboard/");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Card className="border-none shadow-custom">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-examprep-kaabe-maroon">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-examprep-kaabe-light-maroon border-t-examprep-kaabe-maroon" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
            <Trophy className="h-12 w-12 text-examprep-kaabe-light-maroon/30" />
            <p className="text-examprep-kaabe-light-brown">
              No leaderboard data available yet. Start taking quizzes to appear
              on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 rounded-lg p-2 ${
                  user.is_current_user
                    ? "bg-examprep-kaabe-light-maroon/10"
                    : "hover:bg-examprep-kaabe-cream/30"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-examprep-kaabe-cream">
                  {user.rank === 1 ? (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  ) : user.rank === 2 ? (
                    <Medal className="h-4 w-4 text-gray-400" />
                  ) : user.rank === 3 ? (
                    <Medal className="h-4 w-4 text-amber-700" />
                  ) : (
                    <span className="text-sm font-medium text-examprep-kaabe-brown">
                      {user.rank}
                    </span>
                  )}
                </div>
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  {user.profile_picture ? (
                    <Image
                      src={user.profile_picture || "/placeholder.svg"}
                      alt={user.name || user.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-examprep-kaabe-light-maroon/10">
                      <User className="h-5 w-5 text-examprep-kaabe-light-maroon" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-examprep-kaabe-brown">
                    {user.name || user.username}
                    {user.is_current_user && (
                      <span className="ml-1 text-xs text-examprep-kaabe-maroon">
                        (You)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-examprep-kaabe-maroon">
                    {user.score}
                  </span>
                  <span className="ml-1 text-xs text-examprep-kaabe-light-brown">
                    pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
