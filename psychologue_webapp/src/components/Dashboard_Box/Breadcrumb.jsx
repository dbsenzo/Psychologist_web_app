import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import {ChevronRightIcon} from "@chakra-ui/icons"

import PropTypes from 'prop-types';

export function BreadcrumbCustom({ actualPage }) {
    return (
        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href='/'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#'>{actualPage}</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );
}

BreadcrumbCustom.propTypes = {
    actualPage: PropTypes.string.isRequired,
};
