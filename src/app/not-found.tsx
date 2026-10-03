import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col items-center justify-center pt-24 text-center">
      <Ornament width={140} />
      <h1 className="mt-8 font-display text-[3rem] leading-none text-ivory sm:text-[4rem]">This page is not written yet</h1>
      <p className="te mt-3 text-lg text-gold-soft/70">ఈ పుట ఇంకా రాయబడలేదు</p>
      <p className="mt-5 max-w-md text-ivory/55">The ocean of stories is vast — but this shore is still empty.</p>
      <Link href="/" className="btn btn-gold mt-8">
        Return home
      </Link>
    </div>
  );
}
