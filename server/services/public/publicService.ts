import { z } from "zod";
import { db } from "../../utils/db.server";
import CustomError from "../../utils/CustomError";
import { format, subDays } from "date-fns";
export const ZUserName = z.object({
  userName: z.string(),
});

export const ZProduct = z.object({
  id: z.string(),
  userName: z.string(),
});

export const ZChangeOrder = z.array(
  z.object({
    id: z.number(),
    itemOrder: z.number(),
  })
);

export const AnalyticsEntrySchema = z.tuple([
  z.string(), // storeUrl
  z.string(), // date
  z.number(), // pageView
]);
const ZAnalyticsData = z.array(AnalyticsEntrySchema);

export const ZStoreUrl = z.object({
  storeUrl: z.string(),
});

export const ZUpdatePublicUser = z.object({
  storeUrl: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  color: z.string().optional(),
});

export const getPublicUser = async (input: z.infer<typeof ZUserName>) => {
  const publicUser = await db.store.findUnique({
    where: {
      storeUrl: input.userName.toLowerCase(),
    },
    include: {
      storeItems: {
        include: {
          DigitalProduct: true,
          calendarProduct: {
            include: {
              calendarSetting: {
                include: {
                  googleCalendar: true,
                },
              },
            },
          },
          Link: true,
        },
      },
      payments: true,
    },
  });

  const onboardingComplete = publicUser?.payments[0]?.onboardingComplete;

  const transformedUser = publicUser && {
    ...publicUser,
    storeItems: publicUser.storeItems
      .filter(
        (item) =>
          // Assuming visibility is a boolean field indicating if the item is public
          (item.DigitalProduct &&
            item.DigitalProduct.visibility &&
            ((Number(item.DigitalProduct?.price) > 0 && onboardingComplete) ||
              Number(item.DigitalProduct.price) == 0)) ||
          (item.calendarProduct &&
            item.calendarProduct.visibility &&
            item.calendarProduct.calendarSetting.googleCalendar?.email &&
            ((Number(item.calendarProduct?.price) > 0 && onboardingComplete) ||
              Number(item.calendarProduct.price) == 0)) ||
          item.Link
      )
      .map((item) => ({
        id: item.id,
        itemType: item.itemType,
        name:
          item.DigitalProduct?.name ||
          item.calendarProduct?.title ||
          item.Link?.title,
        price: item.DigitalProduct?.price || item.calendarProduct?.price || "0",
        thumbnailUrl: item.Link?.thumbnailUrl || "",
        linkUrl: item.Link?.url || "",
        flexPrice:
          item.DigitalProduct?.flexPrice || item.calendarProduct?.price || "0",
        currency:
          item.DigitalProduct?.currency || item.calendarProduct?.currency,
        itemOrder: item.itemOrder,
        itemTypeId: item.DigitalProduct?.id || item.calendarProduct?.id || "",
        // Add any other fields you need
      })),
  };
  return transformedUser;
};

export const updatePublicUser = async (
  input: z.infer<typeof ZUpdatePublicUser>
) => {
  const updatePublicUser = await db.store.update({
    where: { storeUrl: input.storeUrl.toLowerCase() },
    data: {
      storeTitle: input.displayName,
      storeDescription: input.description,
      thumbnailUrl: input.thumbnailUrl,
      instagram: input.instagram,
      twitter: input.twitter,
      youtube: input.youtube,
      tiktok: input.tiktok,
      color: input.color,
    },
  });
  return updatePublicUser;
};

export const getPublicProduct = async (input: z.infer<typeof ZProduct>) => {
  const product = await db.storeItem.findUnique({
    where: {
      id: parseInt(input.id),
    },
  });

  const store = await db.store.findUnique({
    where: {
      storeUrl: input.userName.toLowerCase(),
    },
  });

  if (store?.id !== product?.storeId)
    throw new CustomError("Product not found", 404);

  if (product?.itemType === "DIGITALPRODUCT") {
    const digitalProduct = await db.digitalProduct.findUnique({
      where: {
        storeItemId: parseInt(input.id),
      },
    });
    return { ...product, itemDetails: digitalProduct };
  }
  if (product?.itemType === "CALENDAR") {
    const calendar = await db.calendarProduct.findUnique({
      where: {
        storeItemId: parseInt(input.id),
      },
    });
    if (!calendar) return product;
    const itemDetails = { ...calendar, name: calendar.title };
    return { ...product, itemDetails };
  }

  return product;
};

export const changeOrder = async (input: z.infer<typeof ZChangeOrder>) => {
  const transaction = input.map((item) =>
    db.storeItem.update({
      where: { id: item.id },
      data: { itemOrder: item.itemOrder },
    })
  );

  try {
    const result = await db.$transaction(transaction);
    return result; // This will return an array of all the updated records
  } catch (error) {
    console.log(error);
    throw new CustomError("Failed to update item order", 500);
  }
};

export const saveOrUpdateAnalytics = async (data: unknown) => {
  try {
    const analyticsData = ZAnalyticsData.parse(data);

    for (const [storeUrl, date, pageView] of analyticsData) {
      const lowerCasedStoreUrl = storeUrl.toLowerCase();
      await db.analytics.upsert({
        where: {
          storeUrl_date: { storeUrl: lowerCasedStoreUrl, date },
        },
        update: {
          pageView,
        },
        create: {
          storeUrl: lowerCasedStoreUrl,
          date,
          pageView,
        },
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating page views:", error);
    throw new CustomError("Failed to update analytics", 500);
  }
};

export const getStoreAnalytics = async (data: z.infer<typeof ZStoreUrl>) => {
  try {
    // Fetch analytics data for the given store URL
    const analyticsData = await db.analytics.findMany({
      where: {
        storeUrl: data.storeUrl.toLowerCase(),
      },
      select: {
        date: true,
        pageView: true,
      },
    });

    return analyticsData;
  } catch (error) {
    console.error("Error fetching page views:", error);
    throw new CustomError("Failed to fetch analytics", 500);
  }
};

export const deleteStoreAnalytics = async () => {
  try {
    const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

    const result = await db.analytics.deleteMany({
      where: {
        date: {
          lt: sevenDaysAgo,
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting analytics records:", error);
    throw new CustomError("Failed to delete analytics", 500);
  }
};
