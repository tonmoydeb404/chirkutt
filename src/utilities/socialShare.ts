export type SocialShare = {
  twitter: string;
  whatsapp: string;
};

export const socialShare = (text: string): SocialShare => {
  const twitter = `https://twitter.com/intent/tweet?text=${text}`;
  const whatsapp = `whatsapp://send?text=${text}`;
  return { twitter, whatsapp };
};
