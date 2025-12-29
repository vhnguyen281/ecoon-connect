import connectDB from "@/config/database";
import Property from "../../../models/Property";
import { getSessionUser } from "@/Utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

export const dynamic = "force-dynamic";
// GET /api/properties/

export const GET = async (request) => {
  try {
    await connectDB();
    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;

    const skip = (page - 1) * pageSize;

    const total = await Property.countDocuments({});

    const properties = await Property.find({})
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const result = {
      total,
      properties,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/properties/

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();

    // Access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image) => image.name !== "");

    //Create propertyData object for database

    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities: formData.getAll("amenities"),
      rates: {
        weekly: formData.get("rates.weekly"),
        nightly: formData.get("rates.nightly"),
        monthly: formData.get("rates.monthly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    //upload images to cloudinary and get their URLs

    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      //convert image to base64 string
      const ImageBase64 = imageData.toString("base64");

      //upload to cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${image.type};base64,${ImageBase64}`,
        {
          folder: "ecoonconnect",
        }
      );

      imageUploadPromises.push(result.secure_url);

      //Wait for all uploads to finish
      const uploadedImages = await Promise.all(imageUploadPromises);
      //Add uploaded image URLs to propertyData
      propertyData.images = uploadedImages;
    }

    //Create and save new property

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );

    // console.log(propertyData);

    // return new Response(
    //   JSON.stringify({ message: "Success" }, { status: 200 })
    // );
  } catch (error) {
    console.error("Error adding property:", error);
    return new Response("Failed to add property", { status: 500 });
  }
};
