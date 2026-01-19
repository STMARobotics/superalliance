const { Router } = require("express");
const quantRouter = Router();
const StandQuantFormSchema = require("../models/StandQuantFormSchema");
const mongoose = require("mongoose");
const { requireAuth, getAuth } = require("@clerk/express");
const { formIdSchema, eventCodeSchema } = require("../validation/paramValidators");

quantRouter.get("/api/form/standquant/:formId", requireAuth(), async (req, res) => {
	const validated = formIdSchema.safeParse(req.params.formId);
	if (!validated.success) {
		return res.status(400).json({
			error: "Invalid formId",
			details: validated.error.issues.map((e) => e.message)
		});
	}
	const formId = validated.data;
	const data = await StandQuantFormSchema.find({ _id: formId }).catch(() => null);
	if (!data) return res.status(404).json({ error: "Form not found" });
	return res.send(data[0]);
});

quantRouter.delete("/api/form/standquant/:formId", requireAuth(), async (req, res) => {
	const userRole = getAuth(req).sessionClaims?.data?.role;
	if (userRole !== "admin") {
		return res.status(403).json({ error: "Forbidden: Admins only" });
	}
	const validated = formIdSchema.safeParse(req.params.formId);
	if (!validated.success) {
		return res.status(400).json({
			error: "Invalid formId",
			details: validated.error.issues.map((e) => e.message)
		});
	}
	const formId = validated.data;
	await StandQuantFormSchema.deleteOne({ _id: formId })
		.then(() => res.send("Form deleted successfully."))
		.catch((err) => res.status(500).json({ error: err.message }));
});

quantRouter.get("/api/forms/standquant/:eventCode", requireAuth(), async (req, res) => {
	const validated = eventCodeSchema.safeParse(req.params.eventCode);
	if (!validated.success) {
		return res.status(400).json({
			error: "Invalid event code",
			details: validated.error.issues.map((e) => e.message)
		});
	}
	const eventCode = validated.data;
	const forms = await StandQuantFormSchema.find({ event: eventCode }).sort({ _id: -1 });
	return res.send(forms);
});

quantRouter.post("/api/form/standquant/submit", requireAuth(), async (req, res) => {
	const data = req.body;
	const sendForm = new StandQuantFormSchema({
		_id: new mongoose.Types.ObjectId(),
		...data,
	});
	await sendForm.save().catch((err) => {
		return res.status(500).send(err);
	});
	return res.send("Submitted Quantitative Stand Form!");
});

module.exports = quantRouter;
