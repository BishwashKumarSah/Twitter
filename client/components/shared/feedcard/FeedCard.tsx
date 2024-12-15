import React from "react";
import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { GoHeartFill } from "react-icons/go";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const data = props.data;
  console.log({ data });
  return (
    data && (
      <div className="flex  p-4  gap-3 border border-r-0 border-l-0 border-b-0 border-gray-800  hover:bg-gray-950 cursor-pointer">
        <div>
          {data.author?.profileImageUrl && (
            <Image
              className="rounded-full"
              src={data.author?.profileImageUrl}
              height={38}
              width={38}
              alt="Profile Image"
            />
          )}
        </div>
        <div className="w-full">
          <Link href={`${data.author.id}`}>
            <h5>{`${data.author?.firstName} ${
              data.author?.lastName !== null ? data.author?.lastName : ""
            }`}</h5>
          </Link>
          <p className="mt-2">{data.content}</p>
          {data.imageUrl &&
            data.imageUrl.map(
              (img) =>
                img && (
                  <div key={img} className="w-full">
                    <Image
                      src={img}
                      alt="tweet-images"
                      height={0}
                      layout="responsive"
                      width={100}
                      style={{
                        height: "auto",
                        maxHeight: "400px",
                        // objectFit: "contain"
                      }}
                    />
                  </div>
                )
            )}
          <div className="flex justify-between items-center max-w-[80%] mt-4 text-[22px]">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <AiOutlineRetweet />
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              {data.isLikedByUser ? <GoHeartFill /> : <FiHeart />}
              <span className="text-sm">{data.likesCount}</span>
            </div>
            <div>
              <LuUpload />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default FeedCard;
