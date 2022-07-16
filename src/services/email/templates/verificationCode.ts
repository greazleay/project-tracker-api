export const getVerificationEmailTemplate = (firstName: string, lastName: string, verificationCode: string) => {
    return `<td class="esd-stripe" style="background-color: #fafafa;" bgcolor="#fafafa" align="center">
    <table class="es-content-body" style="background-color: #ffffff;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
        <tbody>
            <tr>
                <td class="esd-structure es-p40t es-p20r es-p20l" style="background-color: transparent; background-position: left top;" bgcolor="transparent" align="left">
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td class="esd-container-frame" width="560" valign="top" align="center">
                                    <table style="background-position: left top;" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td class="esd-block-image es-p5t es-p5b" align="center" style="font-size:0">
                                                    <a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display: block;" width="175"></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-block-text es-p15t es-p15b" align="center">
                                                    <h1 style="color: #333333; font-size: 20px;"><strong>FORGOT YOUR </strong></h1>
                                                    <h1 style="color: #333333; font-size: 20px;"><strong>&nbsp;PASSWORD?</strong></h1>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-block-text es-p40r es-p40l" align="left">
                                                    <p style="text-align: center;">HI ${firstName} ${lastName}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-block-text es-p35r es-p40l" align="left">
                                                    <p style="text-align: center;">There was a request to change your password!</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-block-text es-p25t es-p40r es-p40l" align="center">
                                                    <p>If did not make this request, just ignore this email. Otherwise, please use the code below to change your password:</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" class="esd-block-text es-p15" bgcolor="#0b5394">
                                                    <p style="color: #ffffff;"><strong>${verificationCode}</strong></p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="esd-structure es-p20t es-p10r es-p10l" style="background-position: center center;" align="left">
                    <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="199" valign="top"><![endif]-->
                    <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                        <tbody>
                            <tr>
                                <td class="esd-container-frame" width="199" align="left">
                                    <table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td class="esd-block-text es-p15t es-m-txt-c" align="right">
                                                    <p style="font-size: 16px; color: #666666;"><strong>Follow us:</strong></p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if mso]></td><td width="20"></td><td width="361" valign="top"><![endif]-->
                    <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                        <tbody>
                            <tr>
                                <td class="esd-container-frame" width="361" align="left">
                                    <table style="background-position: center center;" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td class="esd-block-social es-p10t es-p5b es-m-txt-c" align="left" style="font-size:0">
                                                    <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td class="es-p10r" valign="top" align="center">
                                                                    <a target="_blank" href><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Fb" title="Facebook" width="32"></a>
                                                                </td>
                                                                <td class="es-p10r" valign="top" align="center">
                                                                    <a target="_blank" href><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png" alt="Tw" title="Twitter" width="32"></a>
                                                                </td>
                                                                <td class="es-p10r" valign="top" align="center">
                                                                    <a target="_blank" href><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Ig" title="Instagram" width="32"></a>
                                                                </td>
                                                                <td class="es-p10r" valign="top" align="center">
                                                                    <a target="_blank" href><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/youtube-rounded-gray.png" alt="Yt" title="Youtube" width="32"></a>
                                                                </td>
                                                                <td class="es-p10r" valign="top" align="center">
                                                                    <a target="_blank" href><img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/linkedin-rounded-gray.png" alt="In" title="Linkedin" width="32"></a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if mso]></td></tr></table><![endif]-->
                </td>
            </tr>
            <tr>
                <td class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-position: left top;" align="left">
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td class="esd-container-frame" width="560" valign="top" align="center">
                                    <table width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td class="esd-block-text" esd-links-color="#666666" align="center">
                                                    <p style="font-size: 14px;">Contact us: <a target="_blank" style="font-size: 14px; color: #666666;" href="tel:123456789">123456789</a> | <a target="_blank" href="mailto:your@mail.com" style="font-size: 14px; color: #666666;">your@mail.com</a></p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</td>`
}