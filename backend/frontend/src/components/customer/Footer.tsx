export default function Footer() {
  return (
    <footer className="border-t border-[#E3DED2] bg-[#F3EFE5]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <h2 className="text-xl font-bold tracking-[0.2em]">
          JACRAL
        </h2>

        <p className="mt-3 text-gray-600">
          From nature, to your table.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Jacral. All rights reserved.
        </p>

      </div>
    </footer>
  );
}