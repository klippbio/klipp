import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface DdEmail {
  downloadLink?: string;
  toName?: string;
}

export const DdEmail = ({ downloadLink, toName }: DdEmail) => {
  const previewText = `Order from klipp`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://www.klipp.io/logo.jpg"
                width="40"
                height="40"
                alt="klipp"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Order from <strong>klipp</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {toName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Here are the details of your recent order for meeting with .
              Please click on
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={downloadLink}
              >
                Download Now
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={downloadLink} className="text-blue-600 no-underline">
                {downloadLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This download link was intended for {toName}. If you were not
              expecting this email, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DdEmail.PreviewProps = {
  inviteLink: "https://klipp.io",
  toName: " ",
} as DdEmail;

export default DdEmail;
