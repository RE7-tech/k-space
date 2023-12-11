import GreyCardIcon from '@/public/supporting_documents/grey_card.svg';
import PassportIcon from '@/public/supporting_documents/passport.svg';
import IdCardIcon from '@/public/supporting_documents/id_card.svg';
import DrivingLicenseIcon from '@/public/supporting_documents/driving_license.svg';
import BankAccountIcon from '@/public/supporting_documents/rib.svg';
import ProofOfAddressIcon from '@/public/supporting_documents/proof_of_address.svg';
import EngravingCertificateIcon from '@/public/supporting_documents/engraving_certificate.svg';
import AntiTheftIcon from '@/public/supporting_documents/antitheft.svg';
import RiAutoIcon from '@/public/supporting_documents/ri_auto.svg';
import RiMotoIcon from '@/public/supporting_documents/ri_moto.svg';
import RiVSPIcon from '@/public/supporting_documents/ri_vsp.svg';
import Badge from '@/components/Badge';

const supportingDocumentIcons = {
    'grey_card': GreyCardIcon,
    'passport': PassportIcon,
    'identity_card': IdCardIcon,
    'driver_license': DrivingLicenseIcon,
    'bank_account_statement': BankAccountIcon,
    'proof_of_address': ProofOfAddressIcon,
    'ri_auto': RiAutoIcon,
    'ri_moto': RiMotoIcon,
    'ri_vsp': RiVSPIcon,
    'engraving_certificate': EngravingCertificateIcon,
    'lock_invoice': AntiTheftIcon,
};

const statusBadgeMap = (sd) => {
    switch (sd?.status?.toLowerCase()) {
        case 'validated':
        case 'accepted':
            return <Badge variant="success" className="text-white">Validé</Badge>;
        case 'pending':
            return <Badge variant="info" className="text-white">En cours</Badge>;
        case 'refused':
        case 'rejected':
            return <Badge variant="danger" className="text-white">Refusé</Badge>;
        case 'missing':
            return <Badge variant="warning" className="text-white">Manquant</Badge>;
        default:
            return <Badge variant="success" className="text-white">Validé</Badge>;
    }
};

export { supportingDocumentIcons, statusBadgeMap };