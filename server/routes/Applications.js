const { supabase } = require('../supabase');

const submitApplication = async (c) => {
  try {
    if (!supabase) {
      return c.json({ success: false, message: 'Server misconfiguration: Supabase is not initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY.' }, 500);
    }
    const formData = await c.req.formData();
    
    const applicationData = {
      full_name: formData.get('fullName'),
      email_address: formData.get('emailAddress'),
      contact_number: formData.get('contactNumber'),
      position_applied_for: formData.get('positionAppliedFor'),
      referral_name: formData.get('referralName') || null
    };

    let resumeUrl = null;
    const resumeFile = formData.get('resume');

    // Handle file upload if resume is provided
    if (resumeFile && resumeFile.size > 0) {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}_${applicationData.full_name.replace(/\s+/g, '_')}.${fileExt}`;
      
      const fileBuffer = await resumeFile.arrayBuffer();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, fileBuffer, {
          contentType: resumeFile.type
        });

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);
      
      resumeUrl = publicUrl;
    }

    // Insert application data
    const { data, error } = await supabase
      .from('Applications')
      .insert([{
        ...applicationData,
        resume_url: resumeUrl
      }]);

    if (error) throw error;

    return c.json({ 
      success: true, 
      message: 'Application submitted successfully!',
      data: data 
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return c.json({ 
      success: false, 
      message: error.message 
    }, 500);
  }
};

module.exports = { submitApplication };