import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface MeetingCancelledEmail {
  itemName?: string;
  meetingDetails?: string;
}

export const MeetingCancelledEmail = ({
  itemName,
  meetingDetails,
}: MeetingCancelledEmail) => {
  const previewText = `Meeting Created - klipp`;

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
              Meeting Cancelled - <strong>klipp</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Hi,</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your <strong>{itemName}</strong> on{" "}
              <strong>{meetingDetails}</strong> has been cancelled. Please login
              to klipp using the button below and view the details.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={"https://klipp.io/sign-in"}
              >
                View Meeting Details
              </Button>
            </Section>
            {/* <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you were not expecting this email, please ignore it.
            </Text> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

MeetingCancelledEmail.PreviewProps = {
  toName: " ",
  itemName: " ",
  meetingDetails: " ",
} as MeetingCancelledEmail;

export default MeetingCancelledEmail;
