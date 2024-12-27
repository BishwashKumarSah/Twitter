/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  #graphql\n  mutation BookmarkTweet($payload: BookMarkData!) {\n    BookmarkTweet(payload: $payload) {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        likesCount\n        isLikedByUser\n        author {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      user {\n        id\n        email\n      }\n      userId\n    }\n  }\n": types.BookmarkTweetDocument,
    "\n  #graphql\n  mutation PostCommentByTweetId($payload: CreateTweetComment) {\n    postCommentByTweetId(payload: $payload) {\n      content\n      tweetId\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n": types.PostCommentByTweetIdDocument,
    "\n  #graphql\n  mutation Mutation($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n      content\n      imageUrl\n      author {\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n    }\n  }\n": types.MutationDocument,
    "\n  #graphql\n  mutation LikeTweet($payload: LikeUnlikeTweetData!) {\n    likeTweet(payload: $payload)\n  }\n": types.LikeTweetDocument,
    "\n  #graphql\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n": types.FollowUserDocument,
    "\n  #graphql\n  mutation unFollowUser($to: String!) {\n    unFollowUser(to: $to)\n  }\n": types.UnFollowUserDocument,
    "\n  query GetAllUserBookMarks {\n    getAllUserBookMarks {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": types.GetAllUserBookMarksDocument,
    "\n  #graphql\n  query GetAllCommentsByTweetId($tweetId: String!) {\n    getAllCommentsByTweetId(tweetId: $tweetId) {\n      tweetId\n      user {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      userId\n    }\n  }\n": types.GetAllCommentsByTweetIdDocument,
    "\n  #graphql\n  query getAllTweets {\n    getAllTweets {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n      commentCount\n      likesCount\n      isLikedByUser\n      hasBookMarked\n    }\n  }\n": types.GetAllTweetsDocument,
    "\n  #graphql\n  query GetAllUserTweets($userId: String!) {\n    getAllUserTweets(userId: $userId) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n    }\n  }\n": types.GetAllUserTweetsDocument,
    "\n  #graphql\n  query GetTweetById($tweetId: String!) {\n    getTweetById(tweetId: $tweetId) {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      isLikedByUser\n      commentCount\n      hasBookMarked\n      comment {\n        content\n        tweetId\n        user {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n": types.GetTweetByIdDocument,
    "\n  #graphql\n  query GetAWSPreSignedUrl($imageName: String, $imageType: String!) {\n    getAWSPreSignedUrl(imageName: $imageName, imageType: $imageType)\n  }\n": types.GetAwsPreSignedUrlDocument,
    "\n  #graphql\n  query GetTweetsAndUsersQuery($debouncedSearch: String!) {\n    getTweetsAndUsersQuery(debouncedSearch: $debouncedSearch) {\n      tweet {\n        id\n        content\n      }\n      user {\n        id\n        firstName\n        lastName\n        email\n        following {\n          id\n          email\n        }\n        profileImageUrl\n      }\n    }\n  }\n": types.GetTweetsAndUsersQueryDocument,
    "\n  #graphql\n  query verifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyGoogleTokenDocument,
    "\n  #graphql\n  query getUserDetailsByIdWithoutTweets($id: String!) {\n    getUserDetailsByIdWithoutTweets(id: $id) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n": types.GetUserDetailsByIdWithoutTweetsDocument,
    "\n  #graphql\n  query GetCurrentUserDetails {\n    getCurrentUserDetails {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      recommendedUsers {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n      }\n    }\n  }\n": types.GetCurrentUserDetailsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation BookmarkTweet($payload: BookMarkData!) {\n    BookmarkTweet(payload: $payload) {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        likesCount\n        isLikedByUser\n        author {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      user {\n        id\n        email\n      }\n      userId\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation BookmarkTweet($payload: BookMarkData!) {\n    BookmarkTweet(payload: $payload) {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        likesCount\n        isLikedByUser\n        author {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n      user {\n        id\n        email\n      }\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation PostCommentByTweetId($payload: CreateTweetComment) {\n    postCommentByTweetId(payload: $payload) {\n      content\n      tweetId\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation PostCommentByTweetId($payload: CreateTweetComment) {\n    postCommentByTweetId(payload: $payload) {\n      content\n      tweetId\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation Mutation($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n      content\n      imageUrl\n      author {\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  mutation Mutation($payload: CreateTweetData!) {\n    createTweet(payload: $payload) {\n      id\n      content\n      imageUrl\n      author {\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation LikeTweet($payload: LikeUnlikeTweetData!) {\n    likeTweet(payload: $payload)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation LikeTweet($payload: LikeUnlikeTweetData!) {\n    likeTweet(payload: $payload)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation FollowUser($to: String!) {\n    followUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  mutation unFollowUser($to: String!) {\n    unFollowUser(to: $to)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation unFollowUser($to: String!) {\n    unFollowUser(to: $to)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllUserBookMarks {\n    getAllUserBookMarks {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllUserBookMarks {\n    getAllUserBookMarks {\n      tweetId\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n      userId\n      user {\n        id\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetAllCommentsByTweetId($tweetId: String!) {\n    getAllCommentsByTweetId(tweetId: $tweetId) {\n      tweetId\n      user {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      userId\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetAllCommentsByTweetId($tweetId: String!) {\n    getAllCommentsByTweetId(tweetId: $tweetId) {\n      tweetId\n      user {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getAllTweets {\n    getAllTweets {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n      commentCount\n      likesCount\n      isLikedByUser\n      hasBookMarked\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getAllTweets {\n    getAllTweets {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        profileImageUrl\n        email\n      }\n      commentCount\n      likesCount\n      isLikedByUser\n      hasBookMarked\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetAllUserTweets($userId: String!) {\n    getAllUserTweets(userId: $userId) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetAllUserTweets($userId: String!) {\n    getAllUserTweets(userId: $userId) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n        imageUrl\n        author {\n          id\n          firstName\n          lastName\n          email\n          profileImageUrl\n        }\n        commentCount\n        likesCount\n        isLikedByUser\n        hasBookMarked\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetTweetById($tweetId: String!) {\n    getTweetById(tweetId: $tweetId) {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      isLikedByUser\n      commentCount\n      hasBookMarked\n      comment {\n        content\n        tweetId\n        user {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetTweetById($tweetId: String!) {\n    getTweetById(tweetId: $tweetId) {\n      id\n      content\n      imageUrl\n      author {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      isLikedByUser\n      commentCount\n      hasBookMarked\n      comment {\n        content\n        tweetId\n        user {\n          id\n          email\n          firstName\n          lastName\n          profileImageUrl\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetAWSPreSignedUrl($imageName: String, $imageType: String!) {\n    getAWSPreSignedUrl(imageName: $imageName, imageType: $imageType)\n  }\n"): (typeof documents)["\n  #graphql\n  query GetAWSPreSignedUrl($imageName: String, $imageType: String!) {\n    getAWSPreSignedUrl(imageName: $imageName, imageType: $imageType)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetTweetsAndUsersQuery($debouncedSearch: String!) {\n    getTweetsAndUsersQuery(debouncedSearch: $debouncedSearch) {\n      tweet {\n        id\n        content\n      }\n      user {\n        id\n        firstName\n        lastName\n        email\n        following {\n          id\n          email\n        }\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetTweetsAndUsersQuery($debouncedSearch: String!) {\n    getTweetsAndUsersQuery(debouncedSearch: $debouncedSearch) {\n      tweet {\n        id\n        content\n      }\n      user {\n        id\n        firstName\n        lastName\n        email\n        following {\n          id\n          email\n        }\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query verifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query verifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query getUserDetailsByIdWithoutTweets($id: String!) {\n    getUserDetailsByIdWithoutTweets(id: $id) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query getUserDetailsByIdWithoutTweets($id: String!) {\n    getUserDetailsByIdWithoutTweets(id: $id) {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetCurrentUserDetails {\n    getCurrentUserDetails {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      recommendedUsers {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCurrentUserDetails {\n    getCurrentUserDetails {\n      id\n      firstName\n      lastName\n      email\n      profileImageUrl\n      recommendedUsers {\n        id\n        email\n        firstName\n        lastName\n        profileImageUrl\n      }\n      following {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      follower {\n        id\n        firstName\n        lastName\n        email\n        profileImageUrl\n      }\n      tweet {\n        id\n        content\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;