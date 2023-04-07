import { useTranslations } from "next-intl";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Card({ index, value }) {
  // const t = useTranslations(index)
  const t = value;
  console.log(t);
  return (
    <Link
      className="rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10 relative "
      href={{ pathname: "/home/enter", query: { index: index } }}
    >
      <div className="flex flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg  text-black font-bold">{t["title"]}</span>
        </div>
        <span className="mt-4 text-sm text-gray-500">{t["slogan"]}</span>
      </div>
      <div className=" absolute bottom-0 right-0 w-15 text-sm">
        <FontAwesomeIcon icon={faEye} className="text-gray-400" />
        <span className="text-gray-400 mx-1">{t["viewCount"]}</span>
      </div>
    </Link>
  );
}

export function CardUnavailable({ index, value }) {
  // const t = useTranslations(index)
  const t = value;
  console.log(t);
  return (
    <Link
      className="rounded-lg bg-gray-50 shadow-xl shadow-black/5 ring-1 ring-slate-700/10 text-black text-opacity-25 cursor-not-allowed  pointer-events-none"
      href={{ pathname: "/home/enter", query: { index: index } }}
    >
      <div className="flex flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-black">{t["title"]}</span>
        </div>
        <span className="mt-4 text-sm text-gray-500">{t["slogan"]}</span>
      </div>
    </Link>
  );
}
