using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Comercializacion.Client.Models.Mailing
{
    public class ComercializacionMailingRequest
    {
       
        /// <summary>
        /// Gets or sets the list of all administrator email
        /// </summary>
        public List<string> AdministratorsEmail { get; set; }

        /// <summary>
        /// Gets or sets the modification comments
        /// </summary>
        public string ModificationComments { get; set; }
               
        /// <summary>
        /// Gets or sets event id
        /// </summary>
        public int EventId { get; set; }

        /// <summary>
        /// Gets or sets mail language
        /// </summary>
        public string Language { get; set; }

        /// <summary>
        /// Gets or sets attachment string base 64
        /// </summary>
        public string Attachment { get; set; }
    }
}