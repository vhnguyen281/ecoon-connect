import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/Utils/getSessionUser";

// GET /api/properties/:id

export const GET = async (request, { params }) => {
  try {
    const { id } = await params; // Destructure directly after await
    await connectDB();

    const property = await Property.findById(id);

    if (!property) return new Response("Property not found", { status: 404 });

    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/properties/:id

export const DELETE = async (request, { params }) => {
  try {
    const { id: propertyId } = await params; // Destructure id correctly
    console.log(propertyId);

    //Check user is authenticated
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized - Must be logged in to delete", {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) return new Response("Property not found", { status: 404 });

    //Check user is owner of property
    if (property.owner.toString() !== userId) {
      return new Response("Forbidden - You do not own this property", {
        status: 403,
      });
    }

    await Property.deleteOne({ _id: propertyId });

    return new Response(
      JSON.stringify({ message: "Property deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting property:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/properties/:id

export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { userId } = sessionUser;

    const formData = await request.formData();

    // Access all values from amenities
    const amenities = formData.getAll("amenities");

    // Get property to update
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property not found", { status: 404 });
    }

    // Check if the user is the owner of the property
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Forbidden - You do not own this property", {
        status: 401,
      });
    }

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

    //update property in database
    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData, {
      new: true,
    });

    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return new Response("Failed to update property", { status: 500 });
  }
};
