export function getAvatarByName({
  firstName,
  lastName,
}: {
  firstName: string | undefined;
  lastName: string | undefined;
}) {
  const fullname = (firstName ?? "User") + " " + (lastName ?? "");

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullname,
  )}&background=random&color=fff`;
}
