import BookMarksServerSide from "@/components/shared/server/BookMarksServerSide";
import React from "react";

const BookMarks = ({ params }: { params: { id: string } }) => {
  // console.log("bookmarks", params);
  return (
    <div>
      <BookMarksServerSide userId={params.id} />
    </div>
  );
};

export default BookMarks;
