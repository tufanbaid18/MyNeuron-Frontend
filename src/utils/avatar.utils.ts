export function getAvatarByName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    firstName + " " + lastName,
  )}&background=random&color=fff`;
}
