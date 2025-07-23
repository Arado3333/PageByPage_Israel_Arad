import Version from "./version.model.js";

export async function getVersionsByProjectId(req, res) {
    const projectId = req.params.projectId;

    try {
        const versions = await Version.getAllVersionsByProjectId(projectId);
        res.status(200).json({ success: true, versions: versions });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving versions",
            error,
        });
    }
}


export async function archiveVersion()
{
    
}